import {Link, Outlet} from "@remix-run/react"

export default function RecipesPage() {
	return (
		<>
			<h1 className="m-9 text-5xl">AG-Recettes</h1>
			<div className="space-y-2">
				<Outlet/>
			</div>
		</>
	)
}
