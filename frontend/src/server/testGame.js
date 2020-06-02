import { SEND_OPS, sendMessage } from './socket';

export const clickButton = () => {
  sendMessage(SEND_OPS.TEST_GAME_CLICK_BUTTON);
};
