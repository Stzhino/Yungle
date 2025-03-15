export const calculateTimeDifference=(time)=>{//Calculate difference between current time and the argument.
    const currentDate = new Date()
        let label="seconds";
        const convertedDate=new Date(time)
        let timeDifference =(currentDate-convertedDate);
        if((timeDifference/86400000)>=1)
        {
            label="days ago"
            timeDifference=timeDifference/86400000
        }
        else if((timeDifference/3600000)>=1)
        {
            label="hours ago"
            timeDifference=timeDifference/3600000
        }
        else if(timeDifference/60000>=1)
        {
            label="minutes ago"
            timeDifference=timeDifference/60000
        }
        else
        {
            label="seconds ago"
            timeDifference=timeDifference/1000
        }
        timeDifference=Math.floor(timeDifference);
        return `${timeDifference} ${label}`
}