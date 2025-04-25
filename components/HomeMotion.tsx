"use client"

import { animate, hover } from "motion"
import { splitText } from "motion-plus"
import { useMotionValue } from "motion/react"
import { useEffect, useRef } from "react"

export default function ScatterText() {
    const containerRef = useRef<HTMLDivElement>(null)
    const velocityX = useMotionValue(0)
    const velocityY = useMotionValue(0)
    const prevEvent = useRef(0)

    useEffect(() => {
        if (!containerRef.current) return

        const { chars } = splitText(containerRef.current.querySelector(".h1")!)

        const handlePointerMove = (event: PointerEvent) => {
            const now = performance.now()
            const timeSinceLastEvent = (now - prevEvent.current) / 1000 // seconds
            prevEvent.current = now
            velocityX.set(event.movementX / timeSinceLastEvent)
            velocityY.set(event.movementY / timeSinceLastEvent)
        }

        document.addEventListener("pointermove", handlePointerMove)

        hover(chars, (element) => {
            const speed = Math.sqrt(
                velocityX.get() * velocityX.get() +
                    velocityY.get() * velocityY.get()
            )
            const angle = Math.atan2(velocityY.get(), velocityX.get())
            const distance = speed * 0.1

            animate(
                element,
                {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                },
                { type: "spring", stiffness: 100, damping: 50 }
            )
        })

        return () => {
            document.removeEventListener("pointermove", handlePointerMove)
        }
    }, [velocityX, velocityY]) // Add velocityX and velocityY to the dependency array

    return (
        <div className="back">
            <div className="container" ref={containerRef}>
                <h1 className="h1">Real-Time Notes for Real-Time Thinkers.</h1>
                <Stylesheet />
            </div>
        </div>
    )
}

function Stylesheet() {
    return (
        <style>{`
            .back {
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                max-width: 420px;
                text-align: center;
                color: #0f1115;
            }

            .split-char {
                will-change: transform, opacity;
            }

            h1 {
                font-size: 64px;
            }
        `}</style>
    )
}
