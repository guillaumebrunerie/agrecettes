import {useLoaderData} from "@remix-run/react"
import {json} from "@remix-run/node"
import {type LoaderFunction} from "@remix-run/server-runtime";
import {getHouseholdRecipes} from "~/models/recipes.server";
import { Link } from "react-router-dom";

type FullRecipe = Awaited<ReturnType<typeof getHouseholdRecipes>>[number]

type LoaderData = {
	recipes: FullRecipe[]
}

export const loader: LoaderFunction = async () => {
	const householdId = 1;
	const recipes = await getHouseholdRecipes({householdId})
	const data = {recipes};
	return json<LoaderData>(data)
}

export const RecipeSection = (recipe: FullRecipe) => {
	return (
		<section key={recipe.id} className="mx-2 ring ring-slate-300 bg-slate-200 px-5 py-4 rounded-lg">
			<h2 className="text-xl"><Link to={recipe.id}>{recipe.title}</Link></h2>
			<div className="py-3">
				<span className="text-l">Ingrédients:</span>
				<ul className="marker:text-sky-400 list-disc pl-5 text-slate-500">
					{recipe.ingredients.map(ingredient => (
						<li key={ingredient.id}>
							{ingredient.amount} / {ingredient.type.name}
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
		</section>
	)
}

export default function AllRecipes() {
	const data = useLoaderData() as LoaderData;

	return (
		<>
			<Link to="add">Ajouter une nouvelle recette</Link>
			{data.recipes.map(RecipeSection)}
		</>
	)
}
