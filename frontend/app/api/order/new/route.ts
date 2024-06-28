import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const { data } = await axios.post(
      `${process.env.BACKEND_API}/orders`,
      body
    );
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error });
  }
};
