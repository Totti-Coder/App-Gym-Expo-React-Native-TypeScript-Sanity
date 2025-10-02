import { adminClient } from "@/lib/studio-app-gym/client";

export async function POST(request: Request) {
  //Extrae el workoutId del cuerpo de la peticion HTTP al servidor de sanity
  const { workoutId }: { workoutId: string } = await request.json();

  try {
    //Llama al metodo delete del cliente admin y lo elimina de la base de datos de sanity
    await adminClient.delete(workoutId as string);
    //Respuesta existosa
    console.log("Entrenamiento eliminado correctamente:", workoutId);

    return Response.json({
      sucess: true,
      message: "Entrenamiento eliminado correctamente",
    });
    //Manejo de errores
  } catch (error) {
    console.error(
      "Se ha producido un error al guardar el estado del entrenamiento:",
      error
    );
    return Response.json(
      { error: "Error al cargar  el estado del entrenamiento" },
      { status: 500 }
    );
  }
}
