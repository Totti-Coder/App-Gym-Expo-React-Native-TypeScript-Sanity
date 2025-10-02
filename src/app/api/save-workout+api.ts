import { adminClient } from "@/lib/studio-app-gym/client"

export interface WorkoutData {
    _type: string
    userId: string
    date: string
    durationInSeconds: number
    exercises: {
        _type: string
        _key: string
        exercise: {
            _type: string
            _ref: string
        }
        sets: {
            _type: string
            _key: string
            reps: number
            weight: number
            weightUnit: "lbs" | "kg"
        }[]
    }[]
}

export async function POST(request: Request){
    // Extraer los datos (manejo de JSON)
    let workoutData: WorkoutData;
    try {
        const body = await request.json();
        // Asumiendo que el cuerpo es { workoutData: { ... } }
        if (!body.workoutData) {
            console.error("Error: body.workoutData no encontrado en la solicitud.");
            return Response.json({ error: "Datos de entrenamiento faltantes en el cuerpo de la solicitud" }, { status: 400 });
        }
        workoutData = body.workoutData;
    } catch (e) {
        console.error("Error al parsear JSON:", e);
        return Response.json({ error: "Solicitud JSON no válida" }, { status: 400 });
    }

    // Guardado en Sanity
    try {
        // Usando el cliente admin guardaremos los datos en Sanity
        const result = await adminClient.create(workoutData)
        console.log("Entrenamiento guardado adecuadamente:", result)
        // Respuesta de éxito
        return Response.json({ message: "Entrenamiento guardado con éxito", result }, { status: 200 })
    } catch (error) {
        // Capturamos el error de Sanity y lo imprimimos en la terminal
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al contactar a Sanity."
        
        console.error("Error guardando el entrenamiento:", errorMessage, error) 
        
        // Devolvemos el error al cliente con el estado 500
        return Response.json({ 
            error: "Fallo al guardar el entrenamiento en el servidor", 
            details: errorMessage 
        }, {status: 500})
    }
}