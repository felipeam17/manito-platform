import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, phone, role } = await request.json();

    if (!userId || !email || !name || !phone || !role) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Create user profile
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        phone,
        role,
        kycStatus: role === 'PRO' ? 'PENDING_REVIEW' : 'APPROVED',
      });

    if (userError) {
      console.error('Error creating user profile:', userError);
      return NextResponse.json(
        { error: 'Error al crear el perfil de usuario' },
        { status: 500 }
      );
    }

    // If professional, create pro profile
    if (role === 'PRO') {
      const { error: proError } = await supabase
        .from('pro_profiles')
        .insert({
          userId,
          bio: '',
          serviceRadiusKm: 20,
          coverageCities: [],
          availability: {},
        });

      if (proError) {
        console.error('Error creating pro profile:', proError);
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in create-profile API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
