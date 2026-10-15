// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { AboutModal as PFAboutModal } from '@patternfly/react-core';
import { useVersion, ComponentInfo } from '../hooks/useVersion';
import './AboutModal.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPONENT_LABELS: { key: string; label: string }[] = [
  { key: 'operator', label: 'EI operator' },
  { key: 'engine', label: 'EI engine' },
  { key: 'webapp', label: 'EI webapp' },
  { key: 'cache', label: 'Nginx cache' },
  { key: 'mcpServer', label: 'MCP server' },
  { key: 'mongodb', label: 'MongoDB' },
];

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { versionInfo, loading } = useVersion();

  const components = versionInfo?.components;

  return (
    <PFAboutModal
      isOpen={isOpen}
      onClose={onClose}
      aria-label="About Exploit Intelligence"
      trademark="COPYRIGHT &copy; 2026"
      brandImageSrc="/redhat.svg"
      brandImageAlt="Red Hat"
      className="ei-about-modal"
    >
      <div className="ei-about-modal__content">
        <div className="ei-about-modal__brand-row">
          <img
            src="/redhat.svg"
            alt="Red Hat"
            className="ei-about-modal__brand-logo"
          />
          <h1 className="ei-about-modal__product-name">
            Red Hat Trusted Profile Analyzer
          </h1>
        </div>

        <h2 className="ei-about-modal__subtitle">
          Exploit Intelligence
        </h2>

        <div>
          <p className="ei-about-modal__description">
            Exploit Intelligence is an AI-powered exploitability analysis engine that performs
            deep, function-level analysis on application code paths to determine if detected
            vulnerabilities (CVEs) are reachable and executable in your environment.
            <br />
            For more information refer to{' '}
            <a
              href="https://docs.redhat.com/en/documentation/red_hat_trusted_profile_analyzer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Red Hat Exploit Intelligence documentation
            </a>
          </p>
        </div>

        <div className="ei-about-modal__details">
          <div className="ei-about-modal__detail-row">
            <span className="ei-about-modal__detail-label">Version</span>
            <span className="ei-about-modal__detail-value">
              {loading ? 'Loading...' : versionInfo?.applicationRelease || 'unknown'}
            </span>
          </div>

          {components && (
            <>
              <div className="ei-about-modal__detail-row">
                <span className="ei-about-modal__detail-label">Components</span>
              </div>

              {COMPONENT_LABELS.map(({ key, label }) => {
                const info = components[key as keyof typeof components] as ComponentInfo | null;
                if (!info || info.version === 'not deployed' || info.version === 'unknown') return null;
                return (
                  <div key={key} className="ei-about-modal__component-row">
                    <span className="ei-about-modal__component-label">{label}</span>
                    <span className="ei-about-modal__detail-value">{info.version}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </PFAboutModal>
  );
};

export default AboutModal;
