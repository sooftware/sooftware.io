import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { colors } from '../../styles/colors';
import { SubscribeForm } from './SubscribeForm';

export interface SubscribeProps {
  title: string;
}

export const Subscribe: React.FC<SubscribeProps> = props => (
  <SubscribeFormSection>
    <h3 css={SubscribeFormTitle}>Subscribe to {props.title}</h3>
    <p>Get the latest posts delivered right to your inbox</p>
    <SubscribeForm />
  </SubscribeFormSection>
);

const SubscribeFormSection = styled.section`
  margin: 64px auto 0;
  padding: 40px 32px;
  max-width: 700px;
  text-align: center;
  background: ${colors.surface};
  border-radius: 16px;

  p {
    margin: 8px 0 20px;
    color: ${colors.subtle};
    font-size: 1.6rem;
    line-height: 1.6;
  }

  .form-group {
    flex-grow: 1;
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.darkSurface};

    p {
      color: ${colors.darkSubtle};
    }
  }
`;

const SubscribeFormTitle = css`
  margin: 0;
  padding: 0;
  color: ${colors.text};
  font-size: 2.2rem;
  line-height: 1.4;
  font-weight: 700;

  @media (prefers-color-scheme: dark) {
    color: ${colors.darkText};
  }
`;
