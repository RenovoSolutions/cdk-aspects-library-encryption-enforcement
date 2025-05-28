import {
  aws_ec2 as ec2,
  aws_efs as efs,
  aws_rds as rds,
  Aspects,
  App,
  Stack,
} from 'aws-cdk-lib';
import {
  Annotations,
  Match,
} from 'aws-cdk-lib/assertions';
import {
  EFSEncryptionEnforcementAspect,
  RDSEncryptionEnforcementAspect,
  EncryptionEnforcement,
} from '../src/index';

/**
 * Test suite for Encryption Enforcement Aspects
 *
 * Note that we don't do template or snapshot tests here,
 * because this library doesn't impact the synthesized CloudFormation template directly.
 * Instead, it enforces rules at the construct level and annotates errors.
 */
describe('EncryptionEnforcementAspects', () => {
  let stack: Stack;
  let vpc: ec2.IVpc;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'TestStack');
    vpc = new ec2.Vpc(stack, 'TestVpc');
  });

  test('Annotates error for unencrypted EFS FileSystems', () => {
    // Create an EFS FileSystem without encryption
    new efs.FileSystem(stack, 'TestFileSystem', {
      vpc,
      encrypted: false, // Intentionally set to false
    });

    // Create a CfnFileSystem without encryption
    new efs.CfnFileSystem(stack, 'TestFileSystemCfn', {
      encrypted: false, // Intentionally set to false
    });

    // Get the aspects from the stack
    const aspects = Aspects.of(stack);

    // Apply the EFSEncryptionEnforcementAspect
    aspects.add(new EFSEncryptionEnforcementAspect());

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that error annotations were added
    annotations.hasError('/TestStack/TestFileSystem/Resource', 'EFS FileSystem must be encrypted. Please set the \'encrypted\' property to true.');
    annotations.hasError('/TestStack/TestFileSystemCfn', 'EFS FileSystem must be encrypted. Please set the \'encrypted\' property to true.');

    // Validate that aspect was added and has no exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(EFSEncryptionEnforcementAspect);
    expect((aspects.all[0] as EFSEncryptionEnforcementAspect).excludeResources).toStrictEqual([]);
  });

  test('Does not annotate error for encrypted EFS FileSystems', () => {
    // Create an EFS FileSystem with encryption
    new efs.FileSystem(stack, 'TestFileSystem', {
      vpc,
      encrypted: true,
    });

    // Create a CfnFileSystem with encryption
    new efs.CfnFileSystem(stack, 'TestFileSystemCfn', {
      encrypted: true,
    });

    // Get the aspects from the stack
    const aspects = Aspects.of(stack);

    // Apply the EFSEncryptionEnforcementAspect
    aspects.add(new EFSEncryptionEnforcementAspect());

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that no error annotations were added
    annotations.hasNoError('*', Match.anyValue());

    // Validate that aspect was added and has no exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(EFSEncryptionEnforcementAspect);
    expect((aspects.all[0] as EFSEncryptionEnforcementAspect).excludeResources).toStrictEqual([]);
  });

  test('Excludes specified EFS FileSystems from encryption enforcement', () => {
    // Create an EFS FileSystem without encryption
    new efs.FileSystem(stack, 'TestFileSystem', {
      vpc,
      encrypted: false, // Intentionally set to false
    });

    // Create a CfnFileSystem without encryption
    new efs.CfnFileSystem(stack, 'TestFileSystemCfn', {
      encrypted: false, // Intentionally set to false
    });

    // Get the aspects from the stack
    const aspects = Aspects.of(stack);

    // Apply the EFSEncryptionEnforcementAspect with exclusions
    aspects.add(new EFSEncryptionEnforcementAspect({
      excludeResources: ['TestFileSystem', 'TestFileSystemCfn'],
    }));

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that no error annotations were added for excluded resources
    annotations.hasNoError('*', Match.anyValue());

    // Validate that aspect was added and has the correct exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(EFSEncryptionEnforcementAspect);
    expect((aspects.all[0] as EFSEncryptionEnforcementAspect).excludeResources).toEqual(['TestFileSystem', 'TestFileSystemCfn']);
  });

  test('Annotates error for unencrypted RDS resources', () => {
    // Create an RDS DBInstance without storage encryption
    new rds.DatabaseInstance(stack, 'TestInstance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc,
      storageEncrypted: false, // Intentionally set to false
    });

    // Create a CfnDBInstance without storage encryption
    new rds.CfnDBInstance(stack, 'TestInstanceCfn', {
      engine: 'mysql',
      storageEncrypted: false, // Intentionally set to false
    });

    // Create an RDS DBCluster without storage encryption
    new rds.DatabaseCluster(stack, 'TestCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_4 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [
        rds.ClusterInstance.serverlessV2('reader1'),
      ],
      vpc,
      storageEncrypted: false, // Intentionally set to false
    });

    // Create a CfnDBCluster without storage encryption
    const cfncluster = new rds.CfnDBCluster(stack, 'TestClusterCfn', {
      engine: 'aurora-mysql',
      storageEncrypted: false, // Intentionally set to false
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnWriter', {
      engine: 'aurora-mysql',
      dbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnReader', {
      engine: 'aurora-mysql',
      sourceDbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Get the aspects and annotations from the stack
    const aspects = Aspects.of(stack);

    // Apply the RDSEncryptionEnforcementAspect
    aspects.add(new RDSEncryptionEnforcementAspect());

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that error annotations were added
    annotations.hasError('/TestStack/TestInstance/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
    annotations.hasError('/TestStack/TestInstanceCfn', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
    annotations.hasError('/TestStack/TestCluster/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
    annotations.hasError('/TestStack/TestClusterCfn', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');

    /**
     * L2 ClusterInstances do not have storageEncrypted property,
     * and we already check the parent DBCluster.
     */
    annotations.hasNoError('/TestStack/TestCluster/writer/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
    annotations.hasNoError('/TestStack/TestCluster/reader1/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');

    /**
     * L1 CfnDBInstance associated with CfnDBCluster will not deploy if
     * storageEncrypted disagrees with the parent CfnDBCluster,
     * and we already check the parent CfnDBCluster.
     */
    annotations.hasNoError('/TestStack/TestClusterCfnWriter/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
    annotations.hasNoError('/TestStack/TestClusterCfnReader/Resource', 'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');

    // Validate that aspect was added and has no exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(RDSEncryptionEnforcementAspect);
    expect((aspects.all[0] as RDSEncryptionEnforcementAspect).excludeResources).toStrictEqual([]);
  });

  test('Does not annotate error for encrypted RDS Resources', () => {
    // Create an RDS DBInstance with storage encryption
    new rds.DatabaseInstance(stack, 'TestInstance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc,
      storageEncrypted: true,
    });

    // Create a CfnDBInstance with storage encryption
    new rds.CfnDBInstance(stack, 'TestInstanceCfn', {
      engine: 'mysql',
      storageEncrypted: true,
    });

    // Create an RDS DBCluster with storage encryption
    new rds.DatabaseCluster(stack, 'TestCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_4 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [
        rds.ClusterInstance.serverlessV2('reader1'),
      ],
      vpc,
      storageEncrypted: true,
    });

    // Create a CfnDBCluster with storage encryption
    const cfncluster = new rds.CfnDBCluster(stack, 'TestClusterCfn', {
      engine: 'aurora-mysql',
      storageEncrypted: true,
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnWriter', {
      engine: 'aurora-mysql',
      dbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnReader', {
      engine: 'aurora-mysql',
      sourceDbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Get the aspects from the stack
    const aspects = Aspects.of(stack);

    // Apply the RDSEncryptionEnforcementAspect
    aspects.add(new RDSEncryptionEnforcementAspect());

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that no error annotations were added
    annotations.hasNoError('*', Match.anyValue());

    // Validate that aspect was added and has the no exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(RDSEncryptionEnforcementAspect);
    expect((aspects.all[0] as RDSEncryptionEnforcementAspect).excludeResources).toStrictEqual([]);
  });

  test('Excludes specified RDS resources from encryption enforcement', () => {
    // Create an RDS DBInstance without storage encryption
    new rds.DatabaseInstance(stack, 'TestInstance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc,
      storageEncrypted: false, // Intentionally set to false
    });

    // Create a CfnDBInstance without storage encryption
    new rds.CfnDBInstance(stack, 'TestInstanceCfn', {
      engine: 'mysql',
      storageEncrypted: false, // Intentionally set to false
    });

    // Create an RDS DBCluster without storage encryption
    new rds.DatabaseCluster(stack, 'TestCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_17_4 }),
      writer: rds.ClusterInstance.serverlessV2('writer'),
      readers: [
        rds.ClusterInstance.serverlessV2('reader1'),
      ],
      vpc,
      storageEncrypted: false, // Intentionally set to false
    });

    // Create a CfnDBCluster without storage encryption
    const cfncluster = new rds.CfnDBCluster(stack, 'TestClusterCfn', {
      engine: 'aurora-mysql',
      storageEncrypted: false, // Intentionally set to false
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnWriter', {
      engine: 'aurora-mysql',
      dbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Writer instance associated with CfnDBCluster
    new rds.CfnDBInstance(stack, 'TestClusterCfnReader', {
      engine: 'aurora-mysql',
      sourceDbClusterIdentifier: cfncluster.ref, // Associate with the cluster
    });

    // Get the aspects from the stack
    const aspects = Aspects.of(stack);

    // Apply the RDSEncryptionEnforcementAspect
    aspects.add(new RDSEncryptionEnforcementAspect({ excludeResources: ['TestInstance', 'TestInstanceCfn', 'TestCluster', 'TestClusterCfn'] }));

    // Get the annotations from the stack
    const annotations = Annotations.fromStack(stack);

    // Validate that no error annotations were added for excluded resources
    annotations.hasNoError('*', Match.anyValue());

    // Validate that aspect was added and has the correct exclusions
    expect(aspects.all).toHaveLength(1);
    expect(aspects.all[0]).toBeInstanceOf(RDSEncryptionEnforcementAspect);
    expect((aspects.all[0] as RDSEncryptionEnforcementAspect).excludeResources).toEqual(['TestInstance', 'TestInstanceCfn', 'TestCluster', 'TestClusterCfn']);
  });

  test('Adds all aspects using enforceEncryption function', () => {
    // The exclusions here don't exist in this stack, but that doesn't matter for this test
    const exclusions = {
      excludeResources: ['Resource1', 'Resource2'],
    };
    // Call the enforceEncryption function
    EncryptionEnforcement.addAllAspects(stack, exclusions);

    // Validate that both aspects were added and have the correct exclusions
    const aspects = Aspects.of(stack);
    expect(aspects.all).toHaveLength(2);
    expect(aspects.all[0]).toBeInstanceOf(EFSEncryptionEnforcementAspect);
    expect(aspects.all[1]).toBeInstanceOf(RDSEncryptionEnforcementAspect);
    expect((aspects.all[0] as EFSEncryptionEnforcementAspect).excludeResources).toEqual(exclusions.excludeResources);
    expect((aspects.all[1] as RDSEncryptionEnforcementAspect).excludeResources).toEqual(exclusions.excludeResources);
  });
});