// import 'App.css';
import { HomeCarouselArea } from 'components/homeAreas/HomeCarouselArea';
import React from 'react';
import { HomePricingArea } from 'components/homeAreas/HomePricingArea';
import smoothscroll from 'smoothscroll-polyfill';
import { useDocumentTitle } from 'hooks/useDocumentTitle';
import styled from 'styled-components';
import { HomeFeatureListArea } from 'components/homeAreas/HomeFeatureListArea';
import { HomeContactUsArea } from 'components/homeAreas/HomeContactUsArea';
import { HomeKeyFeatureArea } from 'components/homeAreas/HomeKeyFeatureArea';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

smoothscroll.polyfill();

const Container = styled.div`
  margin: 0 0 120px 0;
  padding: 0;
  max-width: 100%;
`;

const scrollToElement = (selector) => {
  document.querySelector(selector)?.scrollIntoView({
    behavior: 'smooth',
    block: "center",
    inline: "center"
  });
}


export const HomePage = (props) => {
  const { hash } = useLocation();

  useDocumentTitle('All in one task doc management');

  React.useEffect(() => {
    if (hash) {
      const $sub = of(null).pipe(delay(300)).subscribe(() => scrollToElement(hash));
      return () => $sub.unsubscribe();
    }
  }, [hash]);

  return <Container>
    <section>
      <HomeCarouselArea />
    </section>
    {/* <section>
      <HomeFeatureArea />
    </section> */}
    <section>
      <HomeKeyFeatureArea />
    </section>
    <section id="pricing">
      <HomePricingArea />
    </section>
    <section id="features">
      <HomeFeatureListArea />
    </section>
    <section id="contactus">
      <HomeContactUsArea />
    </section>
  </Container>
}

HomePage.propTypes = {};

HomePage.defaultProps = {};

