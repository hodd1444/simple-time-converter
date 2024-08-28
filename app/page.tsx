import TimezoneConverter from '@/components/TimezoneConverter'


export default function Home() {
  const API_KEY = process.env.DB_KEY

  return (
    <main>
      <TimezoneConverter API_KEY={API_KEY} />
    </main>
  )
}