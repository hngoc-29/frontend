
const DangXuat = async () => {

  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return (
    <></>
  )
}
export default DangXuat;