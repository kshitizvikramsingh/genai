import boto3
client = boto3.client('cognito-identity')








response = client.get_credentials_for_identity(
    IdentityId='ap-south-1:7c2932b9-d902-c4e3-a231-ce8e3305344b',
)
