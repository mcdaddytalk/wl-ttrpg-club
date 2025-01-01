import Image from "next/image";



const EvidencePage = () => {
    return (
        <div>
            <h1>Consent Evidence</h1>
            <Image
                src="/images/consent_evidence.png"
                alt="consent evidence"
                priority
                width={600}
                height={600}
            />
        </div>
    )
}

export default EvidencePage;