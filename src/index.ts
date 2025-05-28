import {
  Aspects,
  IAspect,
  CfnResource,
  Annotations,
  aws_efs as efs,
  aws_rds as rds,
} from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

/**
 * Common properties for all aspects in this module.
 */
export interface EncryptionEnforcementAspectProps {
  /**
   * The resources to exclude from enforcement.
   *
   * Use a resource's ID to exclude a specific resource.
   * Supports both CfnResource and L2 construct IDs.
   *
   * @default []
   */
  readonly excludeResources?: string[];
};

/**
 * Common base class for all aspects in this module.
 *
 * This exists to define the common properties and methods for all encryption enforcement aspects.
 * Right now, that's just exposing the `excludeResources` property.
 *
 * @abstract
 * @class EncryptionEnforcementAspect
 * @implements {IAspect}
 */
abstract class EncryptionEnforcementAspect implements IAspect {
  /**
   * The resources to exclude from enforcement.
   *
   * Use a resource's ID to exclude a specific resource.
   * Supports both CfnResource and L2 construct IDs.
   *
   * @default []
   */
  public readonly excludeResources: string[];

  /**
   * Constructs a new EncryptionEnforcementAspect.
   *
   * @param props - Optional properties to configure the aspect.
   */
  constructor(props?: EncryptionEnforcementAspectProps) {
    this.excludeResources = props?.excludeResources ?? [];
  }

  /**
   * Dummy visit method that must be overridden by subclasses.
   * @param _node - The construct to visit.
   */
  visit(_node: IConstruct): void {}
}

/**
 * An aspect that enforces encryption on all EFS FileSystems in the stack.
 */
export class EFSEncryptionEnforcementAspect extends EncryptionEnforcementAspect {
  /**
   * Visits each construct in the stack and enforces encryption on EFS FileSystems.
   *
   * @param node - The construct to visit.
   */
  visit(node: IConstruct) {
    // Check if this is an EFS FileSystem
    if (node instanceof CfnResource && node.cfnResourceType == 'AWS::EFS::FileSystem') {
      // Get the logical ID of the parent construct, so we can properly check for exclusions
      const parent = node.node.scope!.node.id;

      /**
       * If it's an L1 resource, the first condition is relevant.
       * If it's an L2 resource, the second condition is the one.
       * We do this so both L1 and L2 constructs can be excluded by ID.
       */
      if (this.excludeResources?.includes(node.node.id) || this.excludeResources?.includes(parent)) {
        return; // Skip this resource
      }

      // Check if the FileSystem is encrypted
      const encrypted = (node as efs.CfnFileSystem).encrypted;
      if (!encrypted || encrypted.toString() !== 'true') {
        // If not encrypted, annotate an error
        Annotations.of(node).addError(
          'EFS FileSystem must be encrypted. Please set the \'encrypted\' property to true.');
      }
    }
  }
}

/**
 * An aspect that enforces encryption on all RDS databases in the stack.
 * Covers both single instances and clusters.
 */
export class RDSEncryptionEnforcementAspect extends EncryptionEnforcementAspect {
  /**
   * Visits each construct in the stack and enforces encryption on RDS databases.
   *
   * @param node - The construct to visit.
   */
  visit(node: IConstruct) {
    // Check if this is an RDS DBInstance or DBCluster
    if (node instanceof CfnResource && ['AWS::RDS::DBInstance', 'AWS::RDS::DBCluster'].includes(node.cfnResourceType)) {
      // Get the logical ID of the parent construct, so we can properly check for exclusions
      const parent = node.node.scope!.node.id;

      /**
       * If it's an L1 resource, the first condition is relevant.
       * If it's an L2 resource, the second condition is the one.
       * We do this so both L1 and L2 constructs can be excluded by ID.
       */
      if (this.excludeResources?.includes(node.node.id) || this.excludeResources?.includes(parent)) {
        return; // Skip this resource
      }

      if ((node as rds.CfnDBInstance).dbClusterIdentifier !== undefined ||
        (node as rds.CfnDBInstance).sourceDbClusterIdentifier !== undefined) {
        /**
         * If this is a DBInstance that is part of a DBCluster, we skip it.
         * The L2 ClusterInstance class does not have `storageEncrypted` property,
         * it just inherits from the parent DBCluster. We have to skip it or we'd
         * tell the user to change a property that doesn't exist.
         * The L1 CfnDBInstance class does have `storageEncrypted`, but we still skip it
         * because Cfn will not allow it to be set to a conflicting value with the parent DBCluster.
         */
        return;
      }

      /**
       * Check if the database is encrypted
       * This works even if it's actually a DBCluster.
       */
      const encrypted = (node as rds.CfnDBInstance).storageEncrypted;
      if (!encrypted || encrypted.toString() !== 'true') {
        // If not encrypted, annotate an error
        Annotations.of(node).addError(
          'RDS database must have storage encryption enabled. Please set the \'storageEncrypted\' property to true.');
      }
    }
  }
}

/**
 * An convenience class with a static function that adds all of the aspects in this module.
 * It's only a class because jsii skips standalone functions.
 */
export class EncryptionEnforcement {
/**
 * Adds all encryption enforcement aspects to the given scope.
 *
 * This is a convenience method to add all aspects in this module at once.
 * It can be used in the `main` function of your CDK app or in a stack constructor.
 *
 * @param scope - The scope to add the aspects to.
 * @param props - Optional properties to configure the aspects.
 * @returns void
 */
  public static addAllAspects(scope: IConstruct, props?: EncryptionEnforcementAspectProps) {
    Aspects.of(scope).add(new EFSEncryptionEnforcementAspect(props));
    Aspects.of(scope).add(new RDSEncryptionEnforcementAspect(props));
  }
}
