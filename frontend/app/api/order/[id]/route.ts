import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { data } = await axios.get(
      `${process.env.BACKEND_API}/orders/${params.id}`
    );
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { data } = await axios.delete(
      `${process.env.BACKEND_API}/order/${params.id}`
    );
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    console.log(body)
    const { data } = await axios.put(
      `${process.env.BACKEND_API}/order/${params.id}`,
      body
    );
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
};
