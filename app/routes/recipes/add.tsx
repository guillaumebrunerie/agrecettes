import { ActionFunction, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, type LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { getHouseholdRecipes } from "~/models/recipes.server";
import {RecipeSection} from "./index";

type FullRecipe = Awaited<ReturnType<typeof getHouseholdRecipes>>[number]

type LoaderData = {
	recipes: FullRecipe[]
}

type ActionData = {
	formError?: string,
	fieldErrors?: {
		title?: string,
	},
	fields?: {
		title: string,
	}
}
const badRequest = (data: ActionData) => (
	json(data, {status: 400})
)

export const action: ActionFunction = async ({request}) => {
	const fileUploadHandler = unstable_composeUploadHandlers(
		unstable_createFileUploadHandler({
			directory: "./public/uploads",
			file: ({filename}) => filename,
		}),
		unstable_createMemoryUploadHandler(),
	);

	const formData = await unstable_parseMultipartFormData(request, fileUploadHandler);
	const title = formData.get("title");
	if (typeof(title) !== "string" || !title) {
		return badRequest({formError: "Form not submitted correctly"})
	}
	const image = formData.get("upload");
	if (typeof image !== "object" || !image || !("name" in image)) {
		return badRequest({formError: "Form not submitted correctly"})
	}

	await prisma.recipe.create({
		data: {
			title,
			image: image.name,
		},
	});
	return redirect("/recipes");
}

export const loader: LoaderFunction = async () => {
	const householdId = 1;
	const recipes = await getHouseholdRecipes({householdId})
	const data = {recipes};
	return json<LoaderData>(data)
}

export const Button = (props: {[key: string]: unknown}) => {
	const {className, ...rest} = props;
	return (
		<button className={"mt-1 mr-1 px-2 py-0.5 border border-slate-600 rounded bg-green-200 " + className} {...rest}/>
	)
}

const AddRecipeForm = () => {
	// const actionData = useActionData<ActionData>()

	return (
		<Form className="group" method="post" encType="multipart/form-data">
			<section className="mx-2 ring ring-slate-300 bg-slate-200 px-5 py-4 rounded-lg">
				<input
					className="block border-2 rounded border-slate-800 pl-1"
					type="text"
					name="title"
					required
					placeholder="Titre de la recette"/>
				<input className="block" type="file" name="upload" accept="image/png, image/jpeg"/>
				<Button type="submit" className="group-invalid:text-slate-500">
					Ajouter
				</Button>
				<Link to="..">
					<Button className="bg-red-200">
						Annuler
					</Button>
				</Link>
			</section>
		</Form>
	)
}

export default function AddRecipePage() {
	const data = useLoaderData() as LoaderData;

	return (
		<>
			<AddRecipeForm/>
			{data.recipes.map(RecipeSection)}
		</>
	)
}
