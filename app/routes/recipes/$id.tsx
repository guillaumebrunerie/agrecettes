import { redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getRecipe } from "~/models/recipes.server";
import { Form, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { Button } from "./add";
import { prisma } from "~/db.server";

type FullRecipe = Awaited<ReturnType<typeof getRecipe>>

type LoaderData = {
	recipe: FullRecipe
}

export const action: ActionFunction = async ({params}) => {
	const id = params.id;
	if (!id) {
		return null;
	}

	await prisma.recipe.delete({
		where: {
			id
		},
	})
	return redirect("/recipes");
}

export const loader: LoaderFunction = async ({params}) => {
	if (!params.id) {
		return null; // TODO
	}
	const recipe = await getRecipe({id: params.id})
	const data = {recipe};
	return json<LoaderData>(data)
}

export default function RecipeRoute() {
	const data = useLoaderData() as LoaderData;
	const recipe = data.recipe;
	if (!recipe) {
		return null; // TODO
	}

	return (
		<>
			<Link to="..">Revenir à la liste des recettes</Link>
			<section className="mx-2 ring ring-slate-300 bg-slate-200 px-5 py-4 rounded-lg">
				<h2 className="text-xl">{recipe.title}</h2>
				{recipe.image && <img src={"/uploads/" + recipe.image} alt=""/>}
				<div className="py-3">
					<span className="text-l">Ingrédients:</span>
					<ul className="marker:text-sky-400 list-disc pl-5 text-slate-500">
						{recipe.ingredients.map(ingredient => (
							<li key={ingredient.id}>
								{ingredient.type.name} ({ingredient.amount})
							</li>
						))}
					</ul>
				</div>
				<div>
					<span className="text-l">Étapes:</span>
					<ul className="list-disc pl-5">
						{recipe.steps.map(step => <li key={step.id}>{step.step}</li>)}
					</ul>
				</div>
				<Form method="post">
					<Button className="bg-red-200" type="submit" name="action" value="delete">
						Supprimer
					</Button>
				</Form>
			</section>
		</>
	)
}
