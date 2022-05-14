# Node Cron Management

![npm](https://img.shields.io/npm/v/node-cron-management)
![npm](https://img.shields.io/npm/dw/node-cron-management)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/node-cron-management)
![npms.io (final)](https://img.shields.io/npms-io/quality-score/node-cron-management)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/eksant/node-cron-management)

This package is a package to manage cron-jobs in a node.js **Typescript** application. It is built using [node-cron](https://www.npmjs.com/package/node-cron) and [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) packages

## Installation

```bash
npm i node-cron-management
```

## Usage

The package works with decorators and hance the following lines should be in your tsconfig.json file

```javascript
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

Annotate your Job class with **@cronGroup** and annotate each handler with **@cronJob**

```javascript
import { cronGroup, cronJob, CronManager } from "node-cron-management";

@cronGroup('jobs')
class JobService{
    constructor(private name:string){}

    @cronJob('*/1 * * * * *', 'print_name_func')
    printName(){
        console.log(this.name)
    }
}

@cronGroup('auth')
class AuthService{
    constructor(private users: any[]){}

    @cronJob('* * * * * *', 'my_urban_func', 'Asia/Makassar')
    unbanUser(){
        console.log(`There are ${this.users.length} users in the application`)
    }
}

const manager = new CronManager();

const jobService = new JobService('JobService');
const authJob = new AuthService([])

manager.register(JobService, jobService)
manager.register(AuthService,authJob)

manager.startAll() //starts all jobs
manager.stopAll() //stops all jobs

//starting and stopping for specific groups
manager.startGroup('jobs') //starts only jobs in the class with tag equal to jobs
manager.stopGroup('jobs') //stops only jobs in the class with grouptag equal to jobs

//starting and stopping for specific handlers or jobs
manager.startHandler('my_urban_func') //starts the single job with tag equal to my_urban_func
manager.stopHandler('my_urban_func') //stop the single job with tag equal to my_urban_func

manager.getGroups() // returns ['auth','jobs']
manager.getHandlers() //returns ['my_urban_func','print_name_func']
```

## Methods

- **@cronGroup( groupTag? : string )**  
   params
  - **groupTag**: tag to uniquely identify a a set of jobs. The same groupTag can be used for multiple classes. <br><br>
- **@cronJob( cronExpression: string, handlerTag?: string, timezone?: string)**  
   params
  - **cronExpression**: Expression describing the cron interval. The package uses [node-cron](https://www.npmjs.com/package/node-cron) in the background and hence the expression description is the same.
  - **handlerTag**: unique string to identify a single job. The job can be started and stopped using that tag.
  - **timezone**: yhe timezone that is used for job scheduling. See [moment-timezone](https://momentjs.com/timezone) for valid values. <br><br>
- **manager.register(Class:Function, instance: any)**  
   It registers an instance of a class to the cron job manager.  
   params
  - **Class**: The class we're registering
  - **instance**: An instance of that class
