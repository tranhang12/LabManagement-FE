import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { selectAuthState } from "../src/store/auth"
import { baseWsURL } from "../src/services/apiClient"
import { toast } from "react-toastify"

const wsMessageToNotification = (message: MessageEvent) => {
    const jsonMessage = JSON.parse(message.data)
    switch (jsonMessage.notificationType) {
        case 'info':
            toast.success(jsonMessage.message)
            break;
        case 'error':
            toast.error(jsonMessage.message)
            break;
        default:
            break;
    }
}

export const NotificationSubscriber = () => {
    const { accessToken } = useSelector(selectAuthState)
    const socketRef = useRef<WebSocket>()
    const intervalRef = useRef<NodeJS.Timer>()

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const readyState = socketRef.current?.readyState || WebSocket.CLOSED
            console.log("interval", {accessToken, socket: readyState})
            
            if (!accessToken && 
                readyState !== WebSocket.CLOSED) {
                    socketRef.current?.close()
            }
            if (!accessToken) return
            if (accessToken && readyState === WebSocket.OPEN) return
    
            socketRef.current = new WebSocket(baseWsURL)
            socketRef.current.addEventListener("message", wsMessageToNotification);
            socketRef.current.addEventListener("open", (event) => {
                socketRef.current!.send(JSON.stringify({
                    msgType: 'auth',
                    accessToken: accessToken
                }));
            });
        }, 5000)
        return () => {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
        }
    }, [accessToken])
    
    
    return <></>
}