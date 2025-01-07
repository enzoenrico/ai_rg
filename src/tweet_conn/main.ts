import { Rettiwt, Tweet } from 'rettiwt-api';
import { UserInformation } from './interfaces';
import { writeFile } from 'fs/promises';

// Creating a new Rettiwt instance using the API_KEY
const rettiwt = new Rettiwt({ apiKey: 'a2R0PUhmcXU4WGR4ZlF1eVVBR3NrZjcwTE8wV3ZhaEV4emFIdjB3SlJ0TlY7YXV0aF90b2tlbj1hNDJlN2NjMTJhNzFhYzg1ZDUwMjI2Zjk0NzkyYjU5MjA2ODIyYTIxO2N0MD1kMjFiMjQxODcxMTI5NDQ1NmQ4N2JlYzRlNjk0Y2IxMmQzZmNhMjlkYzAzY2JlYWQxMGQzNGFjNWI4NTNiMzMwNTQyNzk0NThmNjk1ZmNjZjFkM2U4OGI2ZjA5NTZmYjMyZWQwMmMyNzExYmU1NTMzZTQ5OWNhMzg1MjgzYjU4ZjMyM2ZhNDg4MDg1ODVmODE4ZmY0ZmM0ZDIzYzBlNjY1O3R3aWQ9dSUzRDE3ODgzMTEyNzM4NzQxMDg0MTY7' });

// const username = 'ky0uko___'

const getUserTweets = async ({ fromUser, numberOfTweets = 20 }: {
    fromUser?: string,
    numberOfTweets?: number
} = {}): Promise<Array<Tweet>> => {
    const selectedForSearch: string = fromUser || username;
    // remove the 'tweet_by' property
    const bonga = await rettiwt.tweet.search({ fromUsers: [selectedForSearch] }, numberOfTweets);
    return bonga.list;
}

const getUserMostMentioned = ({ tweets }: { tweets: Array<Tweet> }): string[] => {
    // gets the 2 most mentioned users based on a array of tweets
    const mentionCounts = new Map<string, number>();
    tweets.forEach(tweet => {
        const matches = tweet.fullText.match(/@\w+/g);
        if (matches) {
            matches.forEach(mention => {
                mentionCounts.set(mention, (mentionCounts.get(mention) || 0) + 1);

            });
        }
    });

    return Array.from(mentionCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([username]) => username.slice(1)); // Remove @ symbol from usernames
}

const getUserDetails = async ({ username }: { username: string }) => {
    return await rettiwt.user.details(username).then(response => (response))
}

const getUserLikes = async () => {
    return await rettiwt.user.likes(20).then(resp => (resp.list))
}

//generate user information object
const generateUserInformation = ({ userDetails, closestConnections, timeline, likes }: {
    userDetails: User,
    closestConnections?: UserInformation[],
    timeline: Tweet[],
    likes: Tweet[]

}): UserInformation => {
    const organizedUserInfo: UserInformation = {
        name: userDetails.userName,
        pfp: userDetails.profileImage,
        bio: userDetails.description,
        pinnedTweet: userDetails.pinnedTweet,
        location: userDetails.location,
        followers: userDetails.followersCount,
        closestConnections: closestConnections,
        timeline: timeline,
        latest_liked: likes

    }
    // console.log('User Details:', organizedUserInfo);
    return organizedUserInfo
}


const logUserInfo = async ({ info }: { info: UserInformation }) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const dated_info = { ...info, timestamp: timestamp }
    const file_path = `./${info.name + timestamp}.json`
    // await mkdir('output', { recursive: true });
    const jsonfied = JSON.stringify(dated_info, null, 4)
    await writeFile(file_path, jsonfied, 'utf-8', (err) => {
        if (err) {
            return console.error(`[!] Error creating ${file_path} JSON object: `, err)
        }
    })
    console.log(`[+]Logs written to ${file_path}`)
    return
}


export const constructRelationTree = async ({ target_user, no_recurse = false }: { target_user: string, no_recurse?: boolean }): UserInformation => {
    const target_user_info = await getUserDetails({ username: target_user })
    console.log(`[+]Got target info!!:${target_user_info.userName}`)

    const target_user_timeline = await getUserTweets({ fromUser: target_user, numberOfTweets: 20 })

    // create connections to top 2 users
    if (no_recurse == false) {
        const target_user_likes = await getUserLikes()
        const target_user_connections = await getUserMostMentioned({ tweets: target_user_timeline })
        const target_users_infomation = await Promise.all(target_user_connections.map(async (user) => {
            return await constructRelationTree({ target_user: user, no_recurse: true })
        }))
        console.log(`[+]Target user information contains: ${target_users_infomation} `)
        const userInfo = generateUserInformation({ userDetails: target_user_info, closestConnections: target_users_infomation, timeline: target_user_timeline, likes: target_user_likes })
        await logUserInfo({ info: userInfo })
        return userInfo

    }

    const userInfo = generateUserInformation({ userDetails: target_user_info, closestConnections: null, timeline: target_user_timeline, likes: null })
    logUserInfo({ info: userInfo })
    return userInfo
}

// const relationTree = await constructRelationTree({ target_user: 'ky0uko___', no_recurse: true })
// console.log('writing tree to file')
// writeFileSync('relationTree.json', String(relationTree));
// console.log(relationTree)
