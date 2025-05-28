# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### EncryptionEnforcementAspectProps <a name="EncryptionEnforcementAspectProps" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps"></a>

Common properties for all aspects in this module.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps.Initializer"></a>

```typescript
import { EncryptionEnforcementAspectProps } from '@renovosolutions/cdk-aspects-library-encryption-enforcement'

const encryptionEnforcementAspectProps: EncryptionEnforcementAspectProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from enforcement. |

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]
- *Default:* []

The resources to exclude from enforcement.

Use a resource's ID to exclude a specific resource.
Supports both CfnResource and L2 construct IDs.

---

## Classes <a name="Classes" id="Classes"></a>

### EFSEncryptionEnforcementAspect <a name="EFSEncryptionEnforcementAspect" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

An aspect that enforces encryption on all EFS FileSystems in the stack.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.Initializer"></a>

```typescript
import { EFSEncryptionEnforcementAspect } from '@renovosolutions/cdk-aspects-library-encryption-enforcement'

new EFSEncryptionEnforcementAspect(props?: EncryptionEnforcementAspectProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps">EncryptionEnforcementAspectProps</a></code> | - Optional properties to configure the aspect. |

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps">EncryptionEnforcementAspectProps</a>

Optional properties to configure the aspect.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.visit">visit</a></code> | Visits each construct in the stack and enforces encryption on EFS FileSystems. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

Visits each construct in the stack and enforces encryption on EFS FileSystems.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

The construct to visit.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from enforcement. |

---

##### `excludeResources`<sup>Required</sup> <a name="excludeResources" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EFSEncryptionEnforcementAspect.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]
- *Default:* []

The resources to exclude from enforcement.

Use a resource's ID to exclude a specific resource.
Supports both CfnResource and L2 construct IDs.

---


### EncryptionEnforcement <a name="EncryptionEnforcement" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement"></a>

An convenience class with a static function that adds all of the aspects in this module.

It's only a class because jsii skips standalone functions.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement.Initializer"></a>

```typescript
import { EncryptionEnforcement } from '@renovosolutions/cdk-aspects-library-encryption-enforcement'

new EncryptionEnforcement()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement.addAllAspects">addAllAspects</a></code> | Adds all encryption enforcement aspects to the given scope. |

---

##### `addAllAspects` <a name="addAllAspects" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement.addAllAspects"></a>

```typescript
import { EncryptionEnforcement } from '@renovosolutions/cdk-aspects-library-encryption-enforcement'

EncryptionEnforcement.addAllAspects(scope: IConstruct, props?: EncryptionEnforcementAspectProps)
```

Adds all encryption enforcement aspects to the given scope.

This is a convenience method to add all aspects in this module at once.
It can be used in the `main` function of your CDK app or in a stack constructor.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement.addAllAspects.parameter.scope"></a>

- *Type:* constructs.IConstruct

The scope to add the aspects to.

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcement.addAllAspects.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps">EncryptionEnforcementAspectProps</a>

Optional properties to configure the aspects.

---



### RDSEncryptionEnforcementAspect <a name="RDSEncryptionEnforcementAspect" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

An aspect that enforces encryption on all RDS databases in the stack.

Covers both single instances and clusters.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.Initializer"></a>

```typescript
import { RDSEncryptionEnforcementAspect } from '@renovosolutions/cdk-aspects-library-encryption-enforcement'

new RDSEncryptionEnforcementAspect(props?: EncryptionEnforcementAspectProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps">EncryptionEnforcementAspectProps</a></code> | - Optional properties to configure the aspect. |

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.EncryptionEnforcementAspectProps">EncryptionEnforcementAspectProps</a>

Optional properties to configure the aspect.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.visit">visit</a></code> | Visits each construct in the stack and enforces encryption on RDS databases. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

Visits each construct in the stack and enforces encryption on RDS databases.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

The construct to visit.

---


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from enforcement. |

---

##### `excludeResources`<sup>Required</sup> <a name="excludeResources" id="@renovosolutions/cdk-aspects-library-encryption-enforcement.RDSEncryptionEnforcementAspect.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]
- *Default:* []

The resources to exclude from enforcement.

Use a resource's ID to exclude a specific resource.
Supports both CfnResource and L2 construct IDs.

---



