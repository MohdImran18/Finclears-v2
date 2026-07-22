import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    const message =
      body.message ?? "";


    return NextResponse.json({

      success: true,

      data: {

        reply:
          `Received message: ${message}`,

      },

    });


  } catch (error) {


    return NextResponse.json(

      {
        success:false,
        message:"Something went wrong"
      },

      {
        status:500
      }

    );

  }

}
