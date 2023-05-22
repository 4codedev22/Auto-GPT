export enum BlePermission {
  /** @member {number} */
  /** enables reading public memory addresses. */
  MemPub = 256,
  /** @member {number} */
  /** enables reading configuration memory addresses. */
  MemCfg = 128,
  /** @member {number} */
  /** enables reading factory memory addresses. */
  MemFac = 64,
  /** @member {number} */
  /** enables sending door control commands. */
  CmdDoor = 32,
  /** @member {number} */
  /** enables sending ignition control commands. */
  CmdIgn = 16,
  /** @member {number} */
  /** enables sending vehicle block control commands. */
  CmdLock = 8,
  /** @member {number} */
  /** enables sending public commands (e.g.: getCurrentStatus, getCANBUSData). */
  CmdPub = 4,
  /** @member {number} */
  /** enables sending configuration commands (e.g.: setKeyholderBehavior). */
  CmdCfg = 2,
  /** @member {number} */
  /** enables sending factory configuration commands. */
  CmdFac = 1,
}
