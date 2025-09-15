import { OpenAI } from "openai"

//Instancia del cliente OpenAI
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})


// Funcion Api Route de Expo Router
export async function POST(request: Request) {
    const {exerciseNombre} = await request.json()

    // Por si el ejercicio no carga 
    if(!exerciseNombre) {
        return Response.json(
            { error: "Se requiere el nombre del ejercicio"},
            {status: 404}
        )
    }

    //Instrucciones para la IA
    const prompt = `
    Eres un entrenador personal.

    Te dan un ejercicio, muestra de forma clara y concisa las instrucciones acerca de como realizar el ejercicio . Incluye el equipamiento necesario para hacerlo si es adecuado. Explica el ejercicio en detalle para alguien principiante.

    El nombre del ejercicio es: ${exerciseNombre}

    Hazlo resumido. Utiliza formato markdown.

    Utiliza el siguiente formato:

    ## Equipamiento Necesario

    ##Instrucciones

    ## Tips

    ## Variantes

    ## Como hacerlo de forma segura

    manten el espacio entre los encabezados y el contenido.

    Utiliza siempre encabezados y sub encabezados.
    `
    console.log(prompt)

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{role: "user", content: prompt}]
        })

        console.log(response)
        //Exito
        return Response.json({message: response.choices[0].message.content})
        //Error
    } catch (error){
        console.error("Error cargando los datos de la guia IA", error)
        return Response.json(
            {error: "Error cargando los datos de la IA"},
            {status:404}
        )
    }
}

