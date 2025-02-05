"use client"

import { useState, useEffect } from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"

interface DatePickerProps {
    value: string
    onChange: (value: string) => void
    required?: boolean
}

export function DatePicker({ value, onChange, required }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(value ? new Date(value) : new Date())
    const [hours, setHours] = useState(selectedDate.getHours())
    const [minutes, setMinutes] = useState(selectedDate.getMinutes())

    const months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ]

    const daysInWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const days = []

        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

        for (let i = startDay; i > 0; i--) {
            const prevDate = new Date(year, month, -i + 1)
            days.push({ date: prevDate, isCurrentMonth: false })
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i)
            days.push({ date: currentDate, isCurrentMonth: true })
        }

        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(year, month + 1, i)
            days.push({ date: nextDate, isCurrentMonth: false })
        }

        return days
    }

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(selectedDate)
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setSelectedDate(newDate)
    }

    const adjustTime = (type: "hours" | "minutes", direction: "up" | "down") => {
        if (type === "hours") {
            const newHours = direction === "up" ? (hours + 1) % 24 : (hours - 1 + 24) % 24
            setHours(newHours)
        } else {
            const newMinutes = direction === "up" ? (minutes + 1) % 60 : (minutes - 1 + 60) % 60
            setMinutes(newMinutes)
        }
    }

    const handleDateSelect = (date: Date) => {
        const newDate = new Date(date)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        setSelectedDate(newDate)
        onChange(newDate.toISOString())
        setIsOpen(false)
    }

    useEffect(() => {
        const newDate = new Date(selectedDate)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        onChange(newDate.toISOString())
    }, [hours, minutes])

    const formatDate = (date: Date) => {
        return date.toLocaleString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={formatDate(selectedDate)}
                onChange={(e) => {
                    const date = new Date(e.target.value)
                    if (!isNaN(date.getTime())) {
                        setSelectedDate(date)
                        onChange(date.toISOString())
                    }
                }}
                onClick={() => setIsOpen(true)}
                onFocus={() => setIsOpen(true)}
                className="tech-input pl-12 cursor-pointer"
                required={required}
            />

            {isOpen && (
                <div className="absolute z-50 mt-2 p-4 tech-card border border-white/10 rounded-lg shadow-xl">
                    <div className="grid grid-cols-[1fr,auto] gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-white/10 rounded">
                                    <ChevronLeftIcon size={20} />
                                </button>
                                <span className="text-sm font-medium text-white">
                                    {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                                </span>
                                <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-white/10 rounded">
                                    <ChevronRightIcon size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {daysInWeek.map((day) => (
                                    <div key={day} className="text-center text-xs text-gray-400 py-1">
                                        {day}
                                    </div>
                                ))}
                                {getDaysInMonth(selectedDate).map(({ date, isCurrentMonth }, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDateSelect(date)}
                                        className={`
                                            p-1 text-sm rounded hover:bg-white/10
                                            ${!isCurrentMonth ? "text-gray-600" : "text-white"}
                                            ${date.toDateString() === selectedDate.toDateString() ? "bg-blue-500 hover:bg-blue-600" : ""}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className="space-y-1">
                                <button
                                    onClick={() => adjustTime("hours", "up")}
                                    className="block w-full p-1 hover:bg-white/10 rounded"
                                >
                                    <ChevronUpIcon size={16} />
                                </button>
                                <div className="text-center py-1 min-w-[2ch] text-white">
                                    {hours.toString().padStart(2, "0")}
                                </div>
                                <button
                                    onClick={() => adjustTime("hours", "down")}
                                    className="block w-full p-1 hover:bg-white/10 rounded"
                                >
                                    <ChevronDownIcon size={16} />
                                </button>
                            </div>

                            <span className="text-xl text-white">:</span>

                            <div className="space-y-1">
                                <button
                                    onClick={() => adjustTime("minutes", "up")}
                                    className="block w-full p-1 hover:bg-white/10 rounded"
                                >
                                    <ChevronUpIcon size={16} />
                                </button>
                                <div className="text-center py-1 min-w-[2ch] text-white">
                                    {minutes.toString().padStart(2, "0")}
                                </div>
                                <button
                                    onClick={() => adjustTime("minutes", "down")}
                                    className="block w-full p-1 hover:bg-white/10 rounded"
                                >
                                    <ChevronDownIcon size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}