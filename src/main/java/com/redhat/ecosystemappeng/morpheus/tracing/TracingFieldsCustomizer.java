package com.redhat.ecosystemappeng.morpheus.tracing;

import io.opentelemetry.context.ContextKey;
import io.opentelemetry.context.propagation.TextMapPropagator;
import io.quarkus.opentelemetry.runtime.propagation.TextMapPropagatorCustomizer;
import io.quarkus.runtime.Startup;
import jakarta.enterprise.context.ApplicationScoped;

@Startup
@ApplicationScoped
public class TracingFieldsCustomizer implements TextMapPropagatorCustomizer {

    public static final String TRACE_ID = "traceId";
    public static final String SPAN_ID = "spanId";
    public static ContextKey<String> getTraceIdContextKey() {
        return TextMapPropagatorImpl.TRACE_ID_CONTEXT_KEY;
    }
    @Override
    public TextMapPropagator customize(Context context) {
        return new TextMapPropagatorImpl();
        };

}

