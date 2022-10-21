const Image = ({ images, imageIndex }) => {

  const leadImage = images[imageIndex % images.length]
  const tailImage = images[(imageIndex - 5) % images.length]

  return (
    <div>Image</div>
  )
}
export default Image