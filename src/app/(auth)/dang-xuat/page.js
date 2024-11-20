
const DangXuat = async() => {
  try{
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response)
  } catch(err) {
    console.log(err)
  }
  return(
    <></>
  )
}
export default DangXuat;