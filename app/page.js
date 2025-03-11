"use client"
import Hero from "@/components/custom/Hero"
import { Calendar } from "@/components/ui/calendar"
import React from "react"

const page = () => {
  const [date, setDate] = React.useState(new Date())

  return (
    <Hero />
  )

}

export default page;