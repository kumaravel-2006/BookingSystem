import api from "./api";

const joinQueue = async (eventId) => {
    const res = await api.post('/queue/join', { eventId })
    return res.data
}

const leaveQueue = async (eventId) => {
    const res = await api.post('/queue/leave', { eventId })
    return res.data
}

const getQueueStatus = async (eventId) => {
    const res = await api.get('/queue/status', { params: { eventId } })
    return res.data
}

export const queueService = {
    joinQueue,
    leaveQueue,
    getQueueStatus
}