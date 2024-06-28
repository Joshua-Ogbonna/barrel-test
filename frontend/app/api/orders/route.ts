import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const { data } = await axios.get(
      `${process.env.BACKEND_API}/orders?page=${page}&limit=10`
    );
    console.log(data);
    return NextResponse.json({ data: data?.data });
  } catch (error) {
    return NextResponse.json({ error });
  }
};
