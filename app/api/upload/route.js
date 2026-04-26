import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const userId = formData.get('userId')

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', uploadPreset)
    uploadData.append('folder', `margadarshak/verifications/${userId}`)
    uploadData.append('resource_type', 'auto')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: uploadData }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error('Cloudinary error:', err)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ url: data.secure_url, publicId: data.public_id })

  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
