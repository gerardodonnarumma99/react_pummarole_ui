import React from 'react'

const TimerContext = React.createContext()

const TimerProvider = TimerContext.Provider
const TimerConsumer = TimerContext.Consumer

export { TimerContext, TimerProvider, TimerConsumer }