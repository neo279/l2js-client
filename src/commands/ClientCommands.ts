import L2Buff from "../entities/L2Buff";
import L2Character from "../entities/L2Character";
import L2Creature from "../entities/L2Creature";
import L2Item from "../entities/L2Item";
import L2Object from "../entities/L2Object";
import { RestartPoint } from "../enums/RestartPoint";
import { ShotsType } from "../enums/ShotsType";
import MMOConfig from "../mmocore/MMOConfig";
import GameClient from "../network/GameClient";
import LoginClient from "../network/LoginClient";
import AbstractGameCommand from "./AbstractGameCommand";
import ICommand from "./ICommand";

import CommandAcceptJoinParty from "./CommandAcceptJoinParty";
import CommandAcceptResurrect from "./CommandAcceptResurrect";
import CommandAttack from "./CommandAttack";
import CommandAutoShots from "./CommandAutoShots";
import CommandCancelBuff from "./CommandCancelBuff";
import CommandCancelTarget from "./CommandCancelTarget";
import CommandCast from "./CommandCast";
import CommandCraft from "./CommandCraft";
import CommandDeclineJoinParty from "./CommandDeclineJoinParty";
import CommandDeclineResurrect from "./CommandDeclineResurrect";
import CommandDropItem from "./CommandDropItem";
import CommandDwarvenCraftRecipes from "./CommandDwarvenCraftRecipes";
import CommandEnter from "./CommandEnter";
import CommandHit from "./CommandHit";
import CommandInventory from "./CommandInventory";
import CommandMoveTo from "./CommandMoveTo";
import CommandNextTarget from "./CommandNextTarget";
import CommandRequestDuel from "./CommandRequestDuel";
import CommandRevive from "./CommandRevive";
import CommandSay from "./CommandSay";
import CommandSayToAlly from "./CommandSayToAlly";
import CommandSayToClan from "./CommandSayToClan";
import CommandSayToParty from "./CommandSayToParty";
import CommandSayToTrade from "./CommandSayToTrade";
import CommandShout from "./CommandShout";
import CommandSitStand from "./CommandSitStand";
import CommandTell from "./CommandTell";
import CommandUseItem from "./CommandUseItem";
import CommandValidatePosition from "./CommandValidatePosition";
import CommandRequestJoinParty from "./CommandRequestJoinParty";
import CommandRequestBypass from "./CommandRequestBypass";

type CommandArgs<Type extends AbstractGameCommand> = Parameters<Type['execute']>

export default abstract class ClientCommands {

  LoginClient = new LoginClient();

  GameClient = new GameClient();

  command<Type extends AbstractGameCommand>(Command: new(LoginClient: LoginClient, GameClient: GameClient) => Type): Type['execute'] {
    const command = new Command(this.LoginClient, this.GameClient);

    return command.execute.bind(command);
  }

  say(...args: CommandArgs<CommandSay>) {
    return this.command(CommandSay)(...args);
  }

  /**
   * Enter Lineage2 world
   */
  enter(...args: CommandArgs<CommandEnter>) {
    return this.command(CommandEnter)(...args);
  }

  /**
   * Shout a message
   */
  shout(...args: CommandArgs<CommandShout>) {
    return this.command(CommandShout)(...args);
  }

  /**
   * Send a PM
   */
  tell(...args: CommandArgs<CommandTell>) {
    return this.command(CommandTell)(...args);
  }

  /**
   * Send message to party
   */
  sayToParty(...args: CommandArgs<CommandSayToParty>) {
    return this.command(CommandSayToParty)(...args);
  }
  /**
   * Send message to clan
   */
  sayToClan(...args: CommandArgs<CommandSayToClan>) {
    return this.command(CommandSayToClan)(...args);
  }
  /**
   * Send message to trade
   */
  sayToTrade(...args: CommandArgs<CommandSayToTrade>) {
    return this.command(CommandSayToTrade)(...args);
  }
  /**
   * Send message to ally
   */
  sayToAlly(...args: CommandArgs<CommandSayToAlly>) {
    return this.command(CommandSayToAlly)(...args);
  }
  /**
   * Move to location
   */
  moveTo(...args: CommandArgs<CommandMoveTo>) {
    return this.command(CommandMoveTo)(...args);
  }
  /**
   * Drop an item at location
   */
  dropItem(...args: CommandArgs<CommandDropItem>) {
    return this.command(CommandDropItem)(...args);
  }
  /**
   * Hit on target. Accepts L2Object object or ObjectId
   */
  hit(...args: CommandArgs<CommandHit>) {
    return this.command(CommandHit)(...args);
  }
  /**
   * Attack a target
   */
  attack(...args: CommandArgs<CommandAttack>) {
    return this.command(CommandAttack)(...args);
  }
  /**
   * Cancel the active target
   */
  cancelTarget(...args: CommandArgs<CommandCancelTarget>) {
    return this.command(CommandCancelTarget)(...args);
  }
  /**
   * Accepts the requested party invite
   */
  acceptJoinParty(...args: CommandArgs<CommandAcceptJoinParty>) {
    return this.command(CommandAcceptJoinParty)(...args);
  }
  /**
   * Declines the requested party invite
   */
  declineJoinParty(...args: CommandArgs<CommandDeclineJoinParty>) {
    return this.command(CommandDeclineJoinParty)(...args);
  }
  /**
   * Select next/closest attackable target
   */
  nextTarget(...args: CommandArgs<CommandNextTarget>) {
    return this.command(CommandNextTarget)(...args);
  }
  /**
   * Request for inventory item list
   */
  inventory(...args: CommandArgs<CommandInventory>) {
    return this.command(CommandInventory)(...args);
  }
  /**
   * Use an item. Accepts L2Item object or ObjectId
   */
  useItem(...args: CommandArgs<CommandUseItem>) {
    return this.command(CommandUseItem)(...args);
  }
  /**
   * Request player a duel. If no char is provided, the command tries to request the selected target
   */
  requestDuel(...args: CommandArgs<CommandRequestDuel>) {
    return this.command(CommandRequestDuel)(...args);
  }
  /**
   * Enable/disable auto-shots
   */
  autoShots(...args: CommandArgs<CommandAutoShots>) {
    return this.command(CommandAutoShots)(...args);
  }
  /**
   * Cancel a buff
   */
  cancelBuff(...args: CommandArgs<CommandCancelBuff>) {
    return this.command(CommandCancelBuff)(...args);
  }
  /**
   * Sit or stand
   */
  sitOrStand(...args: CommandArgs<CommandSitStand>) {
    return this.command(CommandSitStand)(...args);
  }
  /**
   * Sync position with server
   */
  validatePosition(...args: CommandArgs<CommandValidatePosition>) {
    return this.command(CommandValidatePosition)(...args);
  }
  /**
   * Cast a magic skill
   */
  cast(...args: CommandArgs<CommandCast>) {
    return this.command(CommandCast)(...args);
  }
  /**
   * Open dwarven craft recipe book
   */
  dwarvenCraftRecipes(...args: CommandArgs<CommandDwarvenCraftRecipes>) {
    return this.command(CommandDwarvenCraftRecipes)(...args);
  }
  /**
   * Craft an item
   */
  craft(...args: CommandArgs<CommandCraft>) {
    return this.command(CommandCraft)(...args);
  }
  /**
   * Revive to location
   */
  revive(...args: CommandArgs<CommandRevive>) {
    return this.command(CommandRevive)(...args);
  }
  /**
   * Accept resurrect request
   */
  acceptResurrect(...args: CommandArgs<CommandAcceptResurrect>) {
    return this.command(CommandAcceptResurrect)(...args);
  }
  /**
   * Decline resurrect request
   */
  declineResurrect(...args: CommandArgs<CommandDeclineResurrect>) {
    return this.command(CommandDeclineResurrect)(...args);
  }
  /**
   * Send Party Request
   */
  partyInvite(...args: CommandArgs<CommandRequestJoinParty>) {
    return this.command(CommandRequestJoinParty)(...args);
  }
  /**
   * Send bypass to server. (dialog)
   */
  dialog(...args: CommandArgs<CommandRequestBypass>) {
    return this.command(CommandRequestBypass)(...args);
  }

  registerCommand<Type extends AbstractGameCommand>(name: string, Command: { new(LoginClient: LoginClient, GameClient: GameClient): Type }): this {
    if (name in this) {
      throw new Error(`Command ${name} is already registered.`);
    }

    Object.assign(this, {
      [name]: (...args: CommandArgs<Type>) => {
        return this.command(Command)(...args);
      }
    });
    
    return this;
  }
}
