import { CursoredData, Rettiwt, Tweet } from 'rettiwt-api';

// Creating a new Rettiwt instance using the API_KEY
const rettiwt = new Rettiwt({ apiKey: 'a2R0PUhmcXU4WGR4ZlF1eVVBR3NrZjcwTE8wV3ZhaEV4emFIdjB3SlJ0TlY7YXV0aF90b2tlbj1hNDJlN2NjMTJhNzFhYzg1ZDUwMjI2Zjk0NzkyYjU5MjA2ODIyYTIxO2N0MD1kMjFiMjQxODcxMTI5NDQ1NmQ4N2JlYzRlNjk0Y2IxMmQzZmNhMjlkYzAzY2JlYWQxMGQzNGFjNWI4NTNiMzMwNTQyNzk0NThmNjk1ZmNjZjFkM2U4OGI2ZjA5NTZmYjMyZWQwMmMyNzExYmU1NTMzZTQ5OWNhMzg1MjgzYjU4ZjMyM2ZhNDg4MDg1ODVmODE4ZmY0ZmM0ZDIzYzBlNjY1O3R3aWQ9dSUzRDE3ODgzMTEyNzM4NzQxMDg0MTY7' });

const username = 'ky0uko___'

const getUserTweets = async ({ fromUser, numberOfTweets = 20 }: {
    fromUser?: string,
    numberOfTweets?: number
} = {}): Promise<Array<Tweet>> => {
    const selectedForSearch: string = fromUser || username;
    const bonga = await rettiwt.tweet.search({ fromUsers: [selectedForSearch] }, numberOfTweets);
    return bonga.list;
}

const getUserMostMentioned = ({ tweets }: { tweets: Array<Tweet> }) => {
    const mentionCounts = new Map<string, number>();
    tweets.forEach(tweet => {
        const matches = tweet.fullText.match(/@\w+/g);
        if (matches) {
            matches.forEach(mention => {
                mentionCounts.set(mention, (mentionCounts.get(mention) || 0) + 1);
            });
        }
    });
    return mentionCounts;
}

const getUserDetails = async () => {
    return await rettiwt.user.details(username).then(response => (response))
}

const [tweets, details] = await Promise.all([
    getUserTweets(),
    getUserDetails()
]);

const mentions = getUserMostMentioned({ tweets });

console.log('User Details:', details);
console.log('Most Mentioned Users:', Object.fromEntries(mentions));
console.log('Getting mentioned data...')
const most_mentioned = Array.from(mentions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)[0][0] // [['name', count]]
console.log(most_mentioned)

const mostMentionedTimeline = await getUserTweets({ fromUser: most_mentioned, numberOfTweets: 20 })
const mostMentionedInMostMentioned = getUserMostMentioned({ tweets: mostMentionedTimeline })
console.log(mostMentionedInMostMentioned)