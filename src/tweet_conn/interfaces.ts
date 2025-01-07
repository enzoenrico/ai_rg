import { Tweet } from "rettiwt-api"

export interface UserInformation {
    name: string
    pfp: string
    bio: string
    pinnedTweet?: Tweet
    location?: string
    followers: number
    closestConnections?: UserInformation[] //optional, recurse only to 1-2 steps
    timeline: Tweet[]
    latest_liked?: Tweet[] // latest ~20 liked tweets (?) only from authenticade user
}


