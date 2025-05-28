import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  cdkVersion: '2.199.0',
  defaultReleaseBranch: 'master',
  name: '@renovosolutions/cdk-aspects-library-encryption-enforcement',
  description: 'A library of CDK aspects that enforce encryption on AWS resources.',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-aspects-library-encryption-enforcement.git',
  keywords: [
    'encryption',
    'efs',
    'elasticfilesystem',
    'rds',
    'cdk',
    'aws-cdk',
    'aws-cdk-aspects',
    'projen',
  ],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflow: false,
    exclude: ['projen'],
  },
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      semanticTitle: false,
    },
  },
  stale: false,
  releaseToNpm: true,
  release: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  docgen: true,
  eslint: true,
  publishToPypi: {
    distName: 'renovosolutions.aws-cdk-aspects-encryption-enforcement',
    module: 'aspects_encryption_enforcement',
  },
  publishToNuget: {
    dotNetNamespace: 'renovosolutions',
    packageId: 'Renovo.AWSCDK.AspectsEncryptionEnforcement',
  },
});

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: true,
  workflowOptions: {
    schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
  },
});

project.synth();