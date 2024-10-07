export default function getParticipantinfo(participants, email) {
  return participants.find(participant => participant?.email !== email)
}
