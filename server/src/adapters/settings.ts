import { SendEyesSettingsProvider } from "../models/eyes";

export class SendEyesSettingsProviderImpl implements SendEyesSettingsProvider {
  public readonly hitPercent = 0.1;
  public readonly minStandByTime = 5 * 1000;
  public readonly maxStandByTime = 20 * 1000;
  public readonly requireSilenceTime = 5 * 60 * 1000;
}
