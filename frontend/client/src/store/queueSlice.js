import { create } from 'zustand';

export const useQueueStore = create((set) => ({
    //state
    queuePosition: null,
    estimatedWaitMinutes: null,
    isInQueue: false,

    //action 

    setQueueStatus: (position, estimatedWaitMinutes) => set({
        queuePosition: position,
        estimatedWaitMinutes: estimatedWaitMinutes,
        isInQueue: true
    }),

    clearQueue: () => set({
        queuePosition: null,
        estimatedWaitMinutes: null,
        isInQueue: false
    })


}))
