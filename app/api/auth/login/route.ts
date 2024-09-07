import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Login API route hit');
  try {
    const { email, password } = await request.json();
    // Here you would typically validate the credentials and generate a token
    // For now, we'll just return a success message
    return NextResponse.json({ success: true, message: 'Login successful', token: 'dummy_token' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 400 });
  }
}