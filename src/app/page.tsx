import Link from 'next/link';

export default function Home() {
  return (
    <div id="main_content">
      <div className="main_page_section main_introduce main_inner">
        <div className="introduce_display">
          <div className="introduce_title">
            <span className="scoredream-700 text-gray-900 introduce_title_span">멋진 여행을 원하시나요?</span><br/>
            <span className="scoredream-700 text-gray-900 introduce_title_span"><span className="scoredream introduce_title_span_highlight">개미굴 가이드</span>에서 도와드립니다!</span>
          </div>
          <div className="introduce_link">
            <Link href="/">
              <div className="introduce_link_button">
                <span className="scoredream-700 introduce_link_span">여행 계획하기</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="main_page_section main_board main_inner">
        <div className="board_display">

        </div>
      </div>
      <div className="main_page_section main_contact main_inner">
        <div className="contact_display">
          <div className="contact_title">
            <span className="scoredream-700 contact_title_span">여러분들의 응원을 기다리고 있습니다!</span>
          </div>
          <div className="contact_button_section">
            <div className="contact_donate">
              <Link href="https://toon.at/donate/gaemigul">
                <div className="contact_donate_button">
                  <span className="scoredream-500 contact_donate_span">후원</span><br/>
                </div>
              </Link>
            </div>
            <div className="contact_inquiry">
              <Link href="mailto:gaemigul.guide@gmail.com" target="_blank">
                <div className="contact_inquiry_button">
                  <span className="scoredream-500 contact_inquiry_span">문의</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
