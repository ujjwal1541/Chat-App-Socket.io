export default function OnlineUsers({ users, me }) {
  return (
    <div className="users">
      <h4>Online ({users.length})</h4>
      <ul>
        {users.map((u) => (
          <li key={u}>
            <span className="dot" /> {u}{u === me ? ' (you)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
