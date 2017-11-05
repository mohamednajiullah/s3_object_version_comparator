# S3 Object Version Comaparator

**NOTE: This app is under development. It cannot be used yet**

S3 Object Version Comaparator allows you to compare different versions of the text files that you have in your S3 buckets. 

This is a desktop application that is being written using Electron.js in order to be cross platform.  

## Getting Started

### Requirements

This app uses electron.js to compare the text differences in different versions of an Object in a S3 bucket in AWS. It uses the AWS SDK for JavaScript in Node.js

As a result you need [programmatic access](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to use this.
 
### Using AWS Credentials 
This can be done in two ways
1. Create a `config.json` file and add its path to s3.js as follows

```
AWS.config.loadFromPath('./config.json');
```

with the following content to use this app using your credentials.

```
{
  "accessKeyId": "YOUR-ACCESS-KEY-ID",
  "secretAccessKey": "YOUR-SECRET-ACCESS_KEY",
  "region": "YOUR-REGION"
}
```

2. Create a .envrc file in the root level with the following content

```
export AWS_ACCESS_KEY_ID="YOUR-ACCESS-KEY-ID"
export AWS_SECRET_ACCESS_KEY="YOUR-SECRET-ACCESS_KEY"
export AWS_DEFAULT_REGION="YOUR-REGION"

```

### Installing Dependencies

The following command should install all the dependencies required for the app to run.

```
npm install
```

## Running the App

That will start the application.
```
npm start
```

