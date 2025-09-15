/**
* Formats duration in seconds to a human-readable string
* @param seconds - Duration in seconds
* @returns Formatted string like "1h 23m 45s", "23m 45s", or "45s"
 */

export function formatDuration(seconds:number): string{
    if(seconds < 60){
        return `${seconds} s`
    }

    const hours= Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds%3600)/ 60)
    const remainingSeconds = seconds % 60

    if (hours > 0){
        if (remainingSeconds > 0){
            return `${hours}h ${minutes}m ${remainingSeconds}s`
        }else if(minutes>0){
            return `${hours}h ${minutes}m`
        } else { return `${hours}h`
        }

    } else {
        if (remainingSeconds > 0 ){
            return `${minutes}m ${remainingSeconds}s`
        } else {
            return`${minutes}m`
        }
    }
    }
