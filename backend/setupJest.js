const { Anything } = require("./testingUtil");
const { isEqualWith } = require("lodash");

const printPackets = (packets) => {
  return packets
    .map(([opcode, message]) => `${opcode}: ${JSON.stringify(message)}`)
    .join(", ");
};

const anythingCatcher = (a, b) => {
  if (a === Anything || b === Anything) {
    return true;
  }
};

const generateFailureMessage = (reason, packetsA, packetsB) => {
  return {
    pass: false,
    message: () =>
      `${reason}! ${printPackets(packetsA)} !== ${printPackets(packetsB)}`,
  };
};

const generateSuccessMessage = () => {
  return {
    pass: true,
    message: () => `Packet sets are both the same`,
  };
};

expect.extend({
  toMatchPackets(received, packets) {
    if (received.length !== packets.length) {
      return generateFailureMessage(
        "Packet sets are of unequal length",
        received,
        packets
      );
    }
    for (var i = 0; i < received.length; i++) {
      const [receivedOpcode, receivedMessage] = received[i];
      const [packetOpcode, packetMessage] = packets[i];

      if (!isEqualWith(receivedOpcode, packetOpcode, anythingCatcher)) {
        return generateFailureMessage(
          `Packet ${i} had different opcodes`,
          received,
          packets
        );
      } else if (
        !isEqualWith(receivedMessage, packetMessage, anythingCatcher)
      ) {
        return generateFailureMessage(
          `Packet ${i} had different messages`,
          received,
          packets
        );
      }
    }
    return generateSuccessMessage();
  },
});
