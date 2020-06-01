const { Anything } = require("./testingUtil");
const { isEqual } = require("lodash");

const printPackets = (packets) => {
  return packets
    .map(([opcode, message]) => `${opcode}: ${JSON.stringify(message)}`)
    .join(", ");
};

expect.extend({
  toMatchPackets(received, packets) {
    if (received.length !== packets.length) {
      return {
        pass: false,
        message: () =>
          `Packet Sets are of unequal length! ${printPackets(
            received
          )} !== ${printPackets(packets)}`,
      };
    }
    for (var i = 0; i < received.length; i++) {
      const [receivedOpcode, receivedMessage] = received[i];
      const [packetOpcode, packetMessage] = packets[i];

      if (
        receivedOpcode !== packetOpcode &&
        receivedOpcode !== Anything &&
        packetOpcode !== Anything
      ) {
        return {
          pass: false,
          message: () =>
            `Packet ${i} had different opcodes! ${printPackets(
              received
            )} !== ${printPackets(packets)}`,
        };
      } else if (
        !isEqual(receivedMessage, packetMessage) &&
        receivedMessage !== Anything &&
        packetMessage !== Anything
      ) {
        return {
          pass: false,
          message: () =>
            `Packet ${i} had different messages! ${printPackets(
              received
            )} !== ${printPackets(packets)}`,
        };
      }
    }
    return {
      pass: true,
      message: () => `Packet sets are both the same`,
    };
  },
});
