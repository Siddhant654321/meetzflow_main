export default function FeaturesScreen({title, text, lottieAnimation, imageOn, customHeight, marginDown, marginTop}) {
  return (
    <div className='row' style={{minWidth: "100%", margin: '0px'}}>
        <div className={`col-md-6 my-auto ${imageOn === 'right' ? 'order-1' : 'order-md-2 order-1'}`}>
            <h2 className="text-center mb-4 features-headings">{title}</h2>
            <p>{text}</p>
        </div>
        <div className={`col-md-6 mx-auto ${imageOn === 'right' ? 'order-2' : 'order-md-1 order-2'}`}>
            <dotlottie-player src={lottieAnimation} background="transparent" speed="1" style={{width: '100%', maxHeight: customHeight || '280px', padding: '0px', marginDown: marginDown || '0px', marginTop: marginTop || '0px'}} loop autoplay scaleX="5" scaleY="5"></dotlottie-player>
        </div>
    </div>
  )
}
