import {promises as fs} from 'fs';
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({params}) => {
	const filename = params.filename;
	if (!filename) {
		return null;
	}
	const file = await fs.readFile(process.env.UPLOADS_DIR + filename)
	let contentType = "image/jpeg";
	if (filename.endsWith(".png")) {
		contentType = "image/png";
	}
	return new Response(file, {
		headers: {
			"Cache-Control": `public, max-age=3600`,
			"Content-Type": contentType,
			"Content-Length": String(Buffer.byteLength(file)),
		},
	});
}
