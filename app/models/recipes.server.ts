import {type Recipe, type Household} from "@prisma/client";
import { prisma } from "~/db.server";


export function getHouseholdRecipes({householdId}: {householdId: Household["id"] }) {
	return prisma.recipe.findMany({
		// where: {householdId},
		include: {
			ingredients: {include: {type: true}},
			steps: true,
		},
		orderBy: {
			createdAt: "desc",
		}
	})
}

export function getRecipe({id}: {id: Recipe["id"] }) {
	return prisma.recipe.findUnique({
		where: {id},
		include: {
			ingredients: {include: {type: true}},
			steps: true,
		},
	})
}
