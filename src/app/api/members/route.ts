import { NextRequest, NextResponse } from 'next/server';

const api = {
  key: process.env.EXPRESS_API_KEY as string,
  url: process.env.EXPRESS_BASE_URL as string
}

export async function POST(request: NextRequest) {

  const body = await request.json();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, firstName, surname } = body;

  /*
  if (email == 'no-contact@email.com') {
    body.email = 'no-contact-' + firstName.toLowerCase() + '-'+ surname.toLowerCase() + '@email.com'
  }
  */

  const response = await fetch(api.url + '/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': api.key
    },
    body: JSON.stringify(body)
  })
  
  // console.log(response)

  if (response.status === 200) {
    return NextResponse.json({ message: `Form is submit`, response }, { status: 200 })
  }
  else if (response.status === 409) {
    return NextResponse.json({ message: `Email Already In Use.  Please use a different email address.` }, { status: 409 })
  }
  else {
    return NextResponse.json({ message: `something wrong`, response }, { status: response.status })
  }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: `Form is get` }, { status: 200 })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(request: NextRequest) {
  return NextResponse.json({ message: `Form is delete` }, { status: 200 })
}   